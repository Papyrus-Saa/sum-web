'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { DEFAULT_TRANSLATIONS } from '@/i18n/defaultTranslations';
import { SearchInput } from '@/components/search/SearchInput';
import { SearchResult } from '@/components/search/SearchResult';
import { useSearch } from '@/hooks/useSearch';
import { TireSidebar } from '@/components/tire-sidebar/TireSidebar';

export default function Home(): React.ReactElement {
  const { t, ready } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const { data, error, loading, searchType, search } = useSearch();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const title = !mounted || !ready ? DEFAULT_TRANSLATIONS.mainTitle : (t('mainTitle') as string);

  return (
    <main className="w-full flex flex-row min-h-screen">
      <div className="flex flex-col items-center justify-start flex-1 px-2 h-[calc(100vh-var(--header-height))] overflow-auto poem">
        <h1 className="text-center px-1 text-xl sm:text-2xl md:text-3xl lg:text-4xl py-5 mb-6">
          A universal identification system for tires
        </h1>
        {/* Title */}
        <h2 className="text-center px-2 text-lg sm:text-xl max-w-2xl mb-8">{title}</h2>
        <SearchInput onSearch={search} loading={loading} />
        {error && !loading && (
          <div className="w-full max-w-xl mx-auto p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-300 text-sm text-center">{error}</p>
          </div>
        )}
        {/* Search Results */}
        {data && searchType && !loading && !error && (
          <SearchResult data={data} searchType={searchType} />
        )}
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo unde consequuntur ullam sunt
        fugit vero maiores debitis sequi harum assumenda. Quis a, harum magnam fugiat animi voluptas
        repellat officia corporis. Laudantium aperiam veniam modi ipsam, illo dolorem numquam fugiat
        quis quod, doloremque, dignissimos obcaecati? Adipisci, nostrum at iure aut molestiae minus
        harum deleniti, sequi accusamus rem ducimus deserunt sapiente totam! Quo asperiores
        molestiae explicabo harum nisi quas tenetur illo cumque, exercitationem hic rerum quod nihil
        doloribus, commodi possimus. Accusamus quae sunt architecto enim molestiae commodi quis
        vitae? Eum, modi esse? Nisi voluptates optio corrupti hic nulla molestiae in repudiandae
        vitae quis? Adipisci quibusdam veritatis temporibus, illum eveniet quisquam vero neque,
        animi, dolor at ratione accusantium fugit? Iusto consequatur quasi assumenda. Maxime totam
        commodi dolor ex ducimus culpa fugit eveniet autem est mollitia possimus repellat corporis,
        quas vel voluptates eaque facere distinctio, recusandae ipsa sequi aliquid quasi. Natus
        possimus exercitationem modi? Aperiam voluptates rem repellendus totam nam porro quam
        debitis sequi ut natus nulla quas voluptate veritatis vero cupiditate nemo quia adipisci,
        pariatur quis numquam dolore quibusdam hic. Debitis, repudiandae quidem. Enim molestias ipsa
        voluptate, incidunt ut corrupti velit sequi vero nihil quae repudiandae aliquam rerum modi
        non excepturi aspernatur fugiat. Sunt molestias delectus ea fuga distinctio deleniti optio,
        sequi at? Expedita, numquam animi dolore eos impedit pariatur explicabo rerum, voluptate
        laborum at reiciendis sapiente quisquam ea, dolores veritatis quis. Dolorem adipisci ab eum
        libero nostrum a dolor doloremque, nemo facilis! Mollitia architecto, iure doloribus, non ex
        sequi laudantium velit, repudiandae illum adipisci perferendis distinctio placeat at.
        Commodi necessitatibus voluptas officiis, praesentium, nihil nesciunt non cumque maiores,
        fugiat velit in. Dolor. Dicta, esse sed alias veritatis officia ipsam sequi sint inventore
        beatae, consequuntur non animi distinctio repudiandae quidem officiis temporibus quibusdam
        corporis laborum nemo? Minima libero, ullam ratione soluta totam perspiciatis. Omnis rerum
        sed ut eum nemo, minima officia quis quae tenetur officiis blanditiis atque, velit autem
        sint iste distinctio modi perferendis reprehenderit! Numquam, debitis? Reprehenderit minus
        ea impedit iure ut. Nemo, tempora vel atque possimus ex eveniet. Nulla eos tempora molestiae
        modi iure temporibus accusamus minima, veniam repellat porro esse quidem nisi aliquam dicta
        quae placeat officia beatae omnis recusandae? Nobis magnam fugit numquam dignissimos nostrum
        asperiores, voluptates eveniet est, rerum fuga omnis aperiam suscipit nesciunt modi
        assumenda adipisci deserunt deleniti molestias. Laborum dolorem eligendi magnam sapiente
        vel. Quibusdam, sunt. Ducimus at voluptates dicta sequi ipsam id exercitationem nihil ea
        officia assumenda? Perferendis voluptas voluptates cumque dolorem aspernatur necessitatibus,
        repudiandae nobis excepturi inventore vel molestiae eum officiis vero, fugiat error! Quam,
        quis. Culpa placeat ipsum reprehenderit explicabo laborum eligendi eos, ab optio eaque ex
        fuga dignissimos consequuntur? Molestiae harum earum, ducimus unde voluptatum odit aut!
        Deserunt at harum provident hic! Asperiores eum, nisi consequuntur autem iure voluptatibus
        eveniet rerum, omnis voluptatum adipisci minima sit, maxime ullam ratione aperiam natus! Hic
        vel accusantium sit saepe fuga voluptas, ullam itaque dolore voluptate. Expedita eius
        voluptates repudiandae magnam beatae eligendi iste vel, amet, consectetur ut id
        consequuntur, a ipsum nesciunt eum officia veritatis vero fugit nihil dicta magni odit esse?
        In, ad dolor. Temporibus saepe rem, quos magnam exercitationem ex corporis ipsum maxime modi
        esse est pariatur impedit enim, nesciunt amet vero voluptatum in totam ut, officiis
        dignissimos explicabo. A, harum! Pariatur, architecto! Animi suscipit quam magnam illo, fuga
        quidem commodi, quis ad cupiditate maiores nobis quasi eum. Nobis in quo voluptates aut
        velit ipsa dicta explicabo soluta deleniti, expedita enim, accusantium quia! Beatae
        excepturi rem repellendus laborum illo fugit nesciunt eaque sed dolorum? Nihil laboriosam
        corrupti veritatis officia ratione repellendus quos sapiente, alias autem earum omnis
        consectetur, iure qui debitis placeat quidem. Praesentium dolores delectus iste magni sequi
        rerum, distinctio eius cumque voluptates aperiam alias reprehenderit voluptas quas. Suscipit
        provident nesciunt, adipisci, tenetur neque ab accusantium, corrupti consectetur odit iste
        magnam cumque? Dignissimos corporis magni quisquam doloribus voluptatibus illum veritatis
        reiciendis illo, non ullam ut quos ipsa vero nisi distinctio deleniti quam repudiandae.
        Magnam, libero saepe. Aut excepturi autem dolore magni. Debitis! Quae cupiditate similique
        quis aperiam laudantium iure quibusdam veniam ipsam exercitationem. Quia eius optio soluta
        quod quae, voluptatem quos eum reprehenderit magnam, molestiae placeat beatae labore, atque
        fuga a quasi. Laudantium ea maiores blanditiis recusandae pariatur aut aliquam ex
        repudiandae laborum suscipit reiciendis eum optio inventore provident aliquid corporis vitae
        minus, architecto atque, rerum quo. Voluptatem deserunt repudiandae enim qui. Error quam
        commodi optio recusandae dolorum unde dolore. Corrupti odit adipisci voluptatum alias
        excepturi deserunt, praesentium saepe, dicta natus expedita ratione omnis commodi
        perspiciatis nihil. Architecto a quibusdam corporis quod! Nam quo asperiores perspiciatis
        maxime accusantium ipsa voluptates voluptatibus tempora, quaerat illo vel dignissimos
        quisquam corporis reprehenderit consequuntur praesentium quod quam beatae nisi! Similique
        voluptate assumenda voluptatibus sapiente, modi quas! Deserunt distinctio aliquid tenetur?
        Adipisci laborum voluptas minus natus! At consectetur quo id? Possimus earum ullam deserunt
        inventore repudiandae accusamus, quisquam molestiae odit laudantium rerum sapiente beatae
        nam suscipit ipsum. Nisi ipsa soluta suscipit esse et tempore minus eius veniam vero? Neque
        corrupti iusto autem nostrum necessitatibus nemo dicta ipsa? Alias a, labore laboriosam
        maiores fugiat nemo quisquam laudantium facilis. Impedit dolores sed doloremque quia eius
        ipsum accusantium minima at sint excepturi neque iste aut consequuntur necessitatibus
        inventore, tempore nulla nesciunt ducimus, vel, corporis sapiente ipsa placeat. Ipsum, magni
        quos. Tenetur distinctio omnis dolorem, tempore, expedita laborum dolorum tempora dicta ut,
        ipsum natus quia possimus temporibus facere labore asperiores molestias quo? Adipisci soluta
        vitae in modi nihil velit voluptates molestiae. Veritatis asperiores possimus est ea esse
        non repellendus eveniet itaque ad, aut debitis eius veniam quaerat qui libero perspiciatis
        quos animi! Omnis ex sit repellendus consequatur quam deserunt cum eaque? Reiciendis maiores
        tenetur blanditiis tempore illum aperiam eveniet iusto libero culpa laborum pariatur
        cupiditate vel voluptatem veniam id non quo aut dolores nemo, ratione doloribus at
        recusandae! Cupiditate, voluptatum porro? Voluptatum assumenda atque ullam illum nam
        laborum? Nesciunt porro dolorum ullam dolorem accusantium, a nisi beatae! Voluptates atque
        iusto, expedita facere minus quam, enim dolorem non asperiores, exercitationem harum
        consectetur? Odit, quaerat sit? Blanditiis, adipisci? Quod distinctio maxime ipsa placeat,
        illo eligendi modi ratione quia temporibus recusandae vitae atque molestiae. Harum corporis
        perferendis repudiandae eligendi ut hic dicta aliquam quas? Quas quae saepe unde aliquid
        minus. Provident ad distinctio ipsum iusto veniam, quis blanditiis nulla aliquid fugit ea!
        Deserunt corrupti laudantium dolore perspiciatis nobis magnam nam ad. Aperiam, similique
        quia! Nostrum nam iste voluptatem, vitae sed porro quos, perspiciatis, hic ea nihil ex
        assumenda obcaecati numquam ad laborum quo praesentium quam sit reiciendis. Alias nihil
        earum aliquid, numquam a eaque. Ducimus magni nihil id illo quas nisi? Esse aperiam nesciunt
        earum dolorem distinctio accusantium eum sint provident cupiditate non doloribus est neque
        tenetur exercitationem enim dolor velit saepe, in maxime. Labore, id at? Aperiam porro non
        mollitia, veritatis at quis voluptatibus eius et doloremque, libero sunt excepturi tenetur!
        Cum suscipit quis quaerat repellendus, expedita at voluptatibus quae voluptatum quidem
        accusamus. Reiciendis doloribus eos quia cupiditate similique corrupti amet magni commodi
        corporis mollitia. Delectus ducimus quo totam magni nam a harum commodi dolorem eos quod,
        iusto laborum sunt doloribus autem odio! Magnam aspernatur ut minus repudiandae aperiam
        deleniti blanditiis eum eveniet autem veniam, reiciendis optio voluptatibus! Qui, nisi iure
        saepe nobis ullam alias, et optio harum reprehenderit, sint maiores voluptates at.
      </div>
      <div className="hidden sm:flex">
        <TireSidebar />
      </div>
    </main>
  );
}
